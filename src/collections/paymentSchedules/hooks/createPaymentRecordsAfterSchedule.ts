import { CollectionAfterChangeHook } from 'payload'
import { extractID } from '../../../utilities/extractID'

/**
 * @description When a payment schedule is created, this hook will:
 * 1. Find all classrooms
 * 2. Find all students in those classrooms
 * 3. Find all parents of those students
 * 4. Eliminate duplicated parents
 * 5. Create payment records for each parent with the schedule's fee information
 */
export const createPaymentRecordsAfterSchedule: CollectionAfterChangeHook = async ({
  req,
  operation,
  doc,
}) => {
  // Only run on create operation
  if (operation !== 'create') {
    return
  }

  const payload = req.payload

  try {
    // Step 1: Find all classrooms
    const paginatedClassrooms = await payload.find({
      collection: 'classrooms',
      limit: 0, // Adjust as needed
    })
    if (paginatedClassrooms.docs.length === 0) {
      return
    }

    // Step 2: Find all students in those classrooms
    const { docs: allStudents } = await payload.find({
      collection: 'students',
      limit: 0,
      where: {
        classroom: {
          in: paginatedClassrooms.docs.map((classroom) => classroom.id),
        },
      },
    })
    console.log('allStudents', allStudents)

    if (allStudents.length === 0) {
      console.log('No students found in classrooms, skipping payment record creation')
      return
    }

    // Step 3: Find all parents of those students and eliminate duplicates

    // [{parent: id, studentCount: 1}]
    const parentWithStudentCountsArray: { parentID: number; studentCount: number }[] = []
    allStudents.forEach((student) => {
      const foundIndex = parentWithStudentCountsArray.findIndex(
        (item) => item.parentID === extractID(student.parent),
      )
      if (foundIndex !== -1 && parentWithStudentCountsArray[foundIndex]) {
        parentWithStudentCountsArray[foundIndex].studentCount++
      } else {
        parentWithStudentCountsArray.push({ parentID: extractID(student.parent), studentCount: 1 })
      }
    })

    if (parentWithStudentCountsArray.length === 0) {
      return
    }

    // Step 4: Create payment records for each parent
    // TODO: use drizzle insertMany after all. think about the how to create relationship with payer field
    for (const parentWithStudentCounts of parentWithStudentCountsArray) {
      setImmediate(async () => {
        await payload.create({
          collection: 'payment-records',
          data: {
            paymentSchedule: doc.id,
            payer: parentWithStudentCounts.parentID,
            studentCount: parentWithStudentCounts.studentCount,
            tuitionFee: doc.tuitionFee,
            tuitionFeeDescription: doc.tuitionFeeDescription,
            materialFee: doc.materialFee || undefined,
            materialFeeDescription: doc.materialFeeDescription || undefined,
            paid: false,
            notificationStatus: 'idle',
          },
        })
      })
    }
  } catch (error) {
    console.error('Error creating payment records after schedule creation:', error)
    // Don't throw error to avoid breaking the schedule creation
  }
}
