import { Payload } from 'payload'
import { PaymentRecord, Product } from '../payload-types'
import { extractID } from './extractID'

export async function calculatePaymentRecordTotal(paymentRecord: PaymentRecord, payload: Payload) {
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      id: {
        in: paymentRecord.purchases?.map((purchase) =>
          extractID(purchase.productAndQuantity?.product),
        ),
      },
    },
  })
  const tuitionFee = paymentRecord.tuitionFee * paymentRecord.studentCount || 0
  const materialFee = (paymentRecord.materialFee || 0) * paymentRecord.studentCount || 0
  const productsTotal = paymentRecord.purchases?.reduce((acc, purchase) => {
    const price =
      products.find((product) => product.id === extractID(purchase.productAndQuantity?.product))
        ?.price || 0

    return acc + price * (purchase.productAndQuantity?.quantity || 0)
  }, 0)
  return tuitionFee + materialFee + (productsTotal || 0)
}
