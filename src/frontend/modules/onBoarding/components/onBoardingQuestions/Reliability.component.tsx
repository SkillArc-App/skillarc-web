import { Box, Button, Checkbox, Heading } from '@chakra-ui/react'

export const Reliability = ({
  selectedGoals,
  setSelectedGoals,
  onSubmit,
}: {
  selectedGoals: string[]
  setSelectedGoals: (goals: string[]) => void
  onSubmit: () => void
}) => {
  const handleRadioChange = (e: any) => {
    if (e.target.checked) {
      setSelectedGoals([...selectedGoals, e.target.value])
    } else {
      setSelectedGoals(selectedGoals.filter((goal) => goal !== e.target.value))
    }
  }

  return (
    <>
      <Heading variant={'h2'} color={'greyscale.900'}>
        First, we'll let employers know how dependable you are
      </Heading>
      <Box>
        <Checkbox
          onChange={handleRadioChange}
          isChecked={selectedGoals.includes("I've had or currently have a job")}
          value={"I've had or currently have a job"}
          size={'lg'}
          width={'100%'}
          variant={'box'}
          colorScheme="green"
        >
          I've had or currently have a job
        </Checkbox>
        <Checkbox
          onChange={handleRadioChange}
          isChecked={selectedGoals.includes("I've attended a Training Program")}
          value={"I've attended a Training Program"}
          size={'lg'}
          width={'100%'}
          variant={'box'}
          mt={'1rem'}
          colorScheme="green"
        >
          I've attended a Training Program
        </Checkbox>
        <Checkbox
          isChecked={selectedGoals.includes('I have a High School Diploma / GED')}
          value={'I have a High School Diploma / GED'}
          onChange={handleRadioChange}
          size={'lg'}
          variant={'box'}
          width={'100%'}
          mt={'1rem'}
          colorScheme="green"
        >
          I have a High School Diploma / GED
        </Checkbox>
        <Checkbox
          isChecked={selectedGoals.includes("I have other experience I'd like to share")}
          value={"I have other experience I'd like to share"}
          onChange={handleRadioChange}
          size={'lg'}
          variant={'box'}
          width={'100%'}
          mt={'1rem'}
          colorScheme="green"
        >
          I have other experience I'd like to share
        </Checkbox>
        <Button onClick={onSubmit} mt={'0.5rem'} variant={'primary'}>
          Next
        </Button>
      </Box>
    </>
  )
}
