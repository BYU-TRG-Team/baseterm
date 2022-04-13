import React from 'react';
import { 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from 'react-super-responsive-table';
import './index.css';

interface Props {
  headers: string[],
  rows: (string | number | JSX.Element | null)[][],
  mobileBreakpoint?: number;
}

const TableComponent: React.FC<Props> = ({
  headers,
  rows,
}) => {
  return (
    <Table className="table">
      <Thead>
        <Tr>
          {
            headers.map((h: string, index) => (
              <Th className="table__cell" key={index}>{ h }</Th>
            ))
          }
        </Tr>
      </Thead>
      <Tbody>
          {
            rows.map((r, index) => (
              <Tr key={index}>
                {
                  r.map((c, index) => (
                    <Td className="table__cell" key={index}>
                      { 
                        c === null ?
                        <span>&nbsp;</span> :
                        c 
                      }
                    </Td>
                  ))
                }
              </Tr>
            ))
          }
      </Tbody>
    </Table>
  );
}

export default TableComponent;