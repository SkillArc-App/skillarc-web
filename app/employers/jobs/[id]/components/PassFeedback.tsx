import { PassReason, ReasonResponse } from '@/common/types/ApplicantStatus'
import { Button, Checkbox, Stack, Textarea, useCheckboxGroup } from '@chakra-ui/react'
import { useState } from 'react'

type PassFeedbackProps = {
  passReasons: PassReason[]
  onApplicantPass: (responses: ReasonResponse[]) => void
}

type Feedback = {
  [key: string]: string
}

export function PassFeedback({ passReasons, onApplicantPass }: PassFeedbackProps) {
  const { value, getCheckboxProps } = useCheckboxGroup()
  const [feedback, setFeedback] = useState<Feedback>({})

  const responses = (value as string[]).map((id) => {
    return {
      id,
      response: feedback[id],
    }
  })

  return (
    <Stack gap={'2rem'}>
      <Stack gap={'1rem'}>
        <p>Help us find better candidates for you in the future!</p>
      </Stack>
      <Stack>
        {passReasons.map((reason) => {
          return (
            <Stack key={reason.id}>
              <Checkbox value={reason.id} {...getCheckboxProps({ value: reason.id })}>
                {reason.description}
              </Checkbox>
              {value.includes(reason.id) && (
                <Textarea
                  value={feedback[reason.id]}
                  onChange={(e) => {
                    setFeedback((f) => ({
                      ...f,
                      [reason.id]: e.target.value,
                    }))
                  }}
                  placeholder="Can you provide some details..."
                />
              )}
            </Stack>
          )
        })}
      </Stack>
      <Button
        isDisabled={responses.filter((r) => !!r.response).length == 0}
        variant={'primary'}
        onClick={() => {
          onApplicantPass(responses)
        }}
      >
        Submit
      </Button>
    </Stack>
  )
}
