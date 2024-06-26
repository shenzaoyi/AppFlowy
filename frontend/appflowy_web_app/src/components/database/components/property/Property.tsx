import { YjsDatabaseKey } from '@/application/collab.type';
import { FieldType, useCellSelector, useFieldSelector } from '@/application/database-yjs';
import { Cell as CellType, CellProps, TextCell } from '@/components/database/components/cell/cell.type';
import { CheckboxCell } from '@/components/database/components/cell/checkbox';
import { ChecklistCell } from '@/components/database/components/cell/checklist';
import { RowCreateModifiedTime } from '@/components/database/components/cell/created-modified';
import { DateTimeCell } from '@/components/database/components/cell/date';
import { NumberCell } from '@/components/database/components/cell/number';
import { RelationCell } from '@/components/database/components/cell/relation';
import { SelectOptionCell } from '@/components/database/components/cell/select-option';
import { UrlCell } from '@/components/database/components/cell/url';
import PropertyWrapper from '@/components/database/components/property/PropertyWrapper';
import { TextProperty } from '@/components/database/components/property/text';

import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function Property({ fieldId, rowId }: { fieldId: string; rowId: string }) {
  const cell = useCellSelector({
    fieldId,
    rowId,
  });

  const { field } = useFieldSelector(fieldId);
  const fieldType = Number(field?.get(YjsDatabaseKey.type)) as FieldType;

  const { t } = useTranslation();
  const Component = useMemo(() => {
    switch (fieldType) {
      case FieldType.URL:
        return UrlCell;
      case FieldType.Number:
        return NumberCell;
      case FieldType.Checkbox:
        return CheckboxCell;
      case FieldType.SingleSelect:
      case FieldType.MultiSelect:
        return SelectOptionCell;
      case FieldType.DateTime:
        return DateTimeCell;
      case FieldType.Checklist:
        return ChecklistCell;
      case FieldType.Relation:
        return RelationCell;
      default:
        return TextProperty;
    }
  }, [fieldType]) as FC<CellProps<CellType>>;

  const style = useMemo(
    () => ({
      fontSize: '12px',
    }),
    []
  );

  if (fieldType === FieldType.RichText) {
    return <TextProperty cell={cell as TextCell} fieldId={fieldId} rowId={rowId} />;
  }

  if (fieldType === FieldType.CreatedTime || fieldType === FieldType.LastEditedTime) {
    const attrName = fieldType === FieldType.CreatedTime ? YjsDatabaseKey.created_at : YjsDatabaseKey.last_modified;

    return (
      <PropertyWrapper fieldId={fieldId}>
        <RowCreateModifiedTime style={style} rowId={rowId} fieldId={fieldId} attrName={attrName} />
      </PropertyWrapper>
    );
  }

  return (
    <PropertyWrapper fieldId={fieldId}>
      <Component cell={cell} style={style} placeholder={t('grid.row.textPlaceholder')} fieldId={fieldId} rowId={rowId} />
    </PropertyWrapper>
  );
}

export default Property;
