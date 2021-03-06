import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer as MaterialTableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import { Check, DonutLarge, Motorcycle } from '@material-ui/icons'
import { useOrders } from 'hooks'
import { singularOrPlural } from 'utils'

function Orders () {
  const { orders, status } = useOrders()
  console.log('orders:', orders)

  const allOrderStatus = useMemo(() => {
    return [
      {
        title: 'Pedidos pendentes',
        type: status.pending,
        nextAction: status.inProgress,
        nextButtonTitle: 'Em produção',
        icon: DonutLarge
      },

      {
        title: 'Pedidos em produção',
        type: status.inProgress,
        nextAction: status.outForDelivery,
        nextButtonTitle: 'Saiu para entrega',
        icon: Motorcycle
      },

      {
        title: 'Saiu para entrega',
        type: status.outForDelivery,
        nextAction: status.delivered,
        nextButtonTitle: 'Entregue',
        icon: Check
      },

      {
        title: 'Pedidos finalizados',
        type: status.delivered
      }
    ]
  }, [status])

  function getHour (date) {
    const options = {
      hour: 'numeric',
      minute: 'numeric'
    }

    return Intl.DateTimeFormat('pt-BR', options).format(date)
  }

  return allOrderStatus.map(orderStatus => (
    <TableContainer key={orderStatus.title}>
      <TableTitle>
        {orderStatus.title}
      </TableTitle>
      <Table>
        <THead>
          <TableRow>
            <Th>
              <Typography>
                Informações do pedido
              </Typography>
            </Th>

            {orderStatus.nextAction && (
              <Th align='center'>
                <Typography>
                  Mudar status
                </Typography>
              </Th>
            )}
          </TableRow>
        </THead>

        <TableBody>
          {orders?.[orderStatus.type].length === 0 && (
            <TableRow>
              <TableCell>
                <Typography>
                  Nenhum pedido com esse status.
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {orders?.[orderStatus.type].map(order => {
            const {
              address,
              number,
              complement,
              district,
              code: cep,
              city,
              state
            } = order.address

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <div>
                    <Subtitle>
                      Horário do pedido: {getHour(order.createdAt.toDate())}
                    </Subtitle>
                  </div>

                  <div>
                    <Subtitle>
                      Pedido:
                    </Subtitle>

                    <ul>
                      {order.pizzas.map((pizza, index) => (
                        <li key={index}>
                          <Typography>
                            {pizza.quantity} {' '}
                            {singularOrPlural(
                              pizza.quantity,
                              'pizza',
                              'pizzas'
                            )}{' '}
                            {pizza.size.name.toUpperCase()} de {' '}
                            {pizza.flavours
                              .map(flavour => flavour.name)
                              .reduce((acc, flavour, index, array) => {
                                if (index === 0) {
                                  return flavour
                                }

                                if (index === array.length - 1) {
                                  return `${acc} e ${flavour}`
                                }

                                return `${acc}, ${flavour}`
                              }, '')}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Subtitle>
                      Endereço de entrega:
                    </Subtitle>

                    <Typography>
                      {address}, {number && `nº ${number}`} {' '}
                      {complement && `, ${complement}`}<br />
                      Bairro: {district} - CEP: {cep}<br />
                      {city} / {state}
                    </Typography>
                  </div>
                </TableCell>
                {orderStatus.nextAction && (
                  <TableCell align='center'>
                    <Fab
                      color='primary'
                      title={`Mudar status para "${orderStatus.nextButtonTitle}"`}
                      onClick={() => console.log('próximo status:', orderStatus.nextAction)}
                    >
                      <orderStatus.icon />
                    </Fab>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  ))
}

const TableContainer = styled(MaterialTableContainer).attrs({
  component: Paper
})`
  && {
    margin-bottom: ${({ theme }) => theme.spacing(3)}px;
  }
`

const TableTitle = styled(Typography).attrs({
  variant: 'h6'
})`
  && {
    padding: ${({ theme }) => theme.spacing(3)}px;
  }
`

const Subtitle = styled(Typography).attrs({
  variant: 'button'
})`
  && {
    font-weight: bold;
  }
`

const THead = styled(TableHead)`
  && {
    background: ${({ theme }) => theme.palette.common.black};
  }
`

const Th = styled(TableCell)`
  && {
    color: ${({ theme }) => theme.palette.common.white};
  }
`

export default Orders
