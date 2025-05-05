'use client'
import React from 'react'
import { CardT } from '../../_components/card/Card/CardT'
import { useTFunc } from '../../i18n/useTFunc'
import { ButtonT } from '../../_components/button/ButtonT'

export const DashboardHomeContents = () => {
  const { t } = useTFunc()
  return (
    <div className="h-full flex justify-center align-center m-auto gap-4">
      <CardT className="flex flex-col gap-2">
        <h3>宿題</h3>
        <h4>先週の宿題</h4>
        <ul>
          <li>
            <div>
              <h4>Title</h4>
            </div>
          </li>
        </ul>
        <div className="flex flex-row gap-2">
          <ButtonT>{t('一覧')}</ButtonT>
          <ButtonT>{t('新規作成')}</ButtonT>
        </div>
      </CardT>
      <ButtonT>{t('生徒')}</ButtonT>
      <ButtonT>{t('週間レポート')}</ButtonT>
    </div>
  )
}
