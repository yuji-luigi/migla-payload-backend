import { LabelFunction, StaticLabel } from 'payload'

export type LabelsT = {
  plural?: LabelFunction | StaticLabel
  singular?: LabelFunction | StaticLabel
}
