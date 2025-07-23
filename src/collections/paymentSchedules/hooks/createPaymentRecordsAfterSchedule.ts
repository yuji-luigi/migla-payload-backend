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
  console.log('createPaymentRecordsAfterSchedule', operation, doc)
  // Only run on create operation
  if (operation !== 'create') {
    console.log('Not a create or update operation, skipping payment record creation')
    return
  }

  const payload = req.payload

  try {
    // Step 1: Find all classrooms
    const paginatedClassrooms = await payload.find({
      collection: 'classrooms',
      limit: 0, // Adjust as needed
    })
    console.log('paginatedClassrooms', paginatedClassrooms)
    if (paginatedClassrooms.docs.length === 0) {
      console.log('No classrooms found, skipping payment record creation')
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
    // for (const classroom of paginatedClassrooms.docs) {
    //   const paginatedStudents = await payload.find({
    //     collection: 'students',
    //     where: {
    //       classroom: {
    //         in: classroom.id,
    //       },
    //     },
    //     limit: 0,
    //   })
    //   allStudents.push(...paginatedStudents.docs)
    // }

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
    console.log('parentWithStudentCountsArray', parentWithStudentCountsArray)
    // const parentIds = allStudents
    //   .map((student) => student.parent)
    //   .filter((parent) => parent !== null)
    // for (const student of allStudents) {
    //   if (student.parent) {
    //     const parentId = typeof student.parent === 'object' ? student.parent.id : student.parent
    //     parentIds.add(parentId)
    //   }
    // }

    // const uniqueParentIds = Array.from(new Set(parentIds))

    if (parentWithStudentCountsArray.length === 0) {
      console.log('No parents found, skipping payment record creation')
      return
    }

    // Step 4: Create payment records for each parent
    // TODO: use drizzle insertMany after all. think about the how to create relationship with payer field
    for (const parentWithStudentCounts of parentWithStudentCountsArray) {
      console.log('parentWithStudentCounts', parentWithStudentCounts)
      // Count how many students this parent has
      // const parentStudents = allStudents.filter((student) => {
      //   const studentParentId =
      //     typeof student.parent === 'object' ? student.parent.id : student.parent
      //   return studentParentId === parentId
      // })

      // const studentCount = parentStudents.length

      // Create payment record
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
            products: [], // Empty array as specified
            paid: false,
            notificationStatus: 'idle',
          },
        })
      })
      console.log('paymentRecord created')
    }

    console.log(
      `Created ${parentWithStudentCountsArray.length} payment records for payment schedule: ${doc.name}`,
    )
  } catch (error) {
    console.error('Error creating payment records after schedule creation:', error)
    // Don't throw error to avoid breaking the schedule creation
  }
}
