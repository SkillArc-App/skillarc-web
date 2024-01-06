'use client'

import { useApplicationAnalytics } from '@/frontend/hooks/useApplicationAnalytics'
import { Divider, HStack, Spinner, Stack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import 'chart.js/auto'
import { Bar, Pie } from 'react-chartjs-2'

const PieChart = ({ data }: { data: { [key: string]: number } }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Current Statuses',
        data: Object.values(data),
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255, 159, 64)',
        ],
      },
    ],
  }

  return <Pie data={chartData} />
}

const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: 'Time Spent (hours)',
        data: data.map((d) => d.value),
      },
    ],
  }

  if (!data) return <Spinner />

  return <Bar data={chartData} />
}

const Applications = () => {
  const { data: applicationAnalytics } = useApplicationAnalytics()

  const barData = applicationAnalytics?.averageStatusTimes
    .filter((ast) => ast.status !== 'pass' && ast.status !== 'hire')
    .map((ast) => ({
      label: ast.status,
      value: ast.time.days * 24 + ast.time.hours,
    }))

  const tableData = applicationAnalytics?.currentStatusTimes
    .map((ast) => ({
      application: `${ast.id} - ${ast.applicant_name} - ${ast.employment_title} - ${ast.employer_name}`,
      status: ast.status,
      timeSpent: ast.time.days * 24 + ast.time.hours,
    }))
    .sort((a, b) => b.timeSpent - a.timeSpent)

  // count by status
  const pieData = applicationAnalytics?.currentStatusTimes.reduce<{
    [key: string]: number
  }>((acc, ast) => {
    if (acc[ast.status]) acc[ast.status]++
    else acc[ast.status] = 1
    return acc
  }, {})

  return (
    <Stack gap={'1rem'}>
      <HStack height={'300px'}>
        <BarChart data={barData ?? []} />
        <PieChart data={pieData ?? {}} />
      </HStack>
      <Divider />
      <Table>
        <Thead>
          <Tr>
            <Th>Application</Th>
            <Th>Current Status</Th>
            <Th>Time Spent (hours)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData?.map((td, index) => {
            return (
              <Tr key={index}>
                <Td>{td.application}</Td>
                <Td>{td.status}</Td>
                <Td>{td.timeSpent}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Stack>
  )
}

export default Applications
