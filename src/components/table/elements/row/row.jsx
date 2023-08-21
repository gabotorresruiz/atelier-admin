import React, { useCallback, useMemo } from 'react';
import { styled } from '@mui/system';
import moment from 'moment-timezone';
import { Checkbox, TableCell, TableRow, Tooltip } from '@mui/material';

const StyledImageCell = styled(TableCell)`
  width: 5%;
`;

const StyledImageCellWrapper = styled('div')`
  height: 35px;
  width: 100%;
`;

const StyledNumericTableCell = styled(TableCell)`
  width: 25%;
`;

const StyledImg = styled('img')`
  height: 35px;
  object-fit: scale-down;
  width: 100%;
`;

moment.updateLocale('es', {
  relativeTime: {
    future: 'en %s',
    past: '%s',
    s: 'hace unos segundos',
    ss: 'hace %d segundos',
    m: 'hace un minuto',
    mm: 'hace %d minutos',
    h: 'hace una hora',
    hh: 'hace %d horas',
    d: 'hace un día',
    dd: 'hace %d días',
    w: 'hace una semana',
    ww: 'hace %d semanas',
    M: 'hace un mes',
    MM: 'hace %d meses',
    y: 'hace un año',
    yy: 'hace %d años',
  },
});

const Row = ({ data, headColumns, index, selected, setSelected }) => {
  const itemSelected = useMemo(() => selected === data.id, [data.id, selected]);

  const handleClick = useCallback(() => {
    if (itemSelected) return setSelected(null);

    setSelected(data.id);
  }, [data.id, itemSelected, setSelected]);

  return (
    <TableRow
      hover
      onClick={handleClick}
      role='checkbox'
      aria-checked={itemSelected}
      tabIndex={-1}
      key={data.id}
      selected={itemSelected}
    >
      <TableCell padding='checkbox'>
        <Checkbox
          color='primary'
          checked={itemSelected}
          inputProps={{
            'aria-labelledby': `table-checkbox-${index}`,
          }}
        />
      </TableCell>
      {headColumns.map(item => {
        switch (item.type) {
          case 'image':
            return (
              <StyledImageCell key={item.id}>
                <StyledImageCellWrapper>
                  <StyledImg
                    alt=''
                    src={`data:image/jpeg;base64,${data[item.id]}`}
                  />
                </StyledImageCellWrapper>
              </StyledImageCell>
            );

          case 'numeric':
            const formatter = new Intl.NumberFormat('de-DE', {
              style: 'currency',
              currency: 'USD',
            });

            return (
              <StyledNumericTableCell key={item.id} align='right'>
                {formatter.format(data[item.id])}
              </StyledNumericTableCell>
            );

          case 'date':
            const date = data[item.id].split('T')[0];
            const dateNow = moment(data[item.id])
              .tz('America/Montevideo')
              .toNow(true);
            const dateFull = moment(`${date}T12:00:00`)
              .tz('America/Montevideo')
              .format('DD/MM/YYYY');

            return (
              <TableCell key={item.id} align='right'>
                <Tooltip title={dateFull} placement='bottom-end'>
                  <span>{dateNow}</span>
                </Tooltip>
              </TableCell>
            );

          default:
            return <TableCell key={item.id}>{data[item.id]}</TableCell>;
        }
      })}
    </TableRow>
  );
};

export default Row;
