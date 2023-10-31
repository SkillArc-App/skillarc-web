import { prisma } from '../db/client'
import hiringStatus from './hiring-status-service'

const findFor = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      trainingProviderProfile: {
        include: {
          trainingProvider: true,
        },
      },
    },
  })

  const trainingProviderId: string = user?.trainingProviderProfile?.trainingProvider.id as string

  const programs = await prisma.program.findMany({
    where: {
      training_provider_id: trainingProviderId,
    },
    include: {
      seekerTrainingProvider: {
        include: {
          seeker_training_provider_program_statuses: true,
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  })

  // N + 1 problem here obviously 🤷
  return await Promise.all(
    programs.map(async (program) => {
      const students: {
        email: string | null
        firstName: string | null
        lastName: string | null
        profileId: string | undefined
        reference: { referenceText: string | null; referenceId: string | null }
        status: string
        hiringStatus: string
      }[] = await Promise.all(
        program.seekerTrainingProvider.map(async (stp) => {
          const references = await prisma.reference.findMany({
            where: {
              seeker_profile_id: stp.user.profile?.id,
              training_provider_id: program.training_provider_id,
            },
          })

          if (references.length > 1) {
            throw new Error(
              `There should be one reference for each profile. There are ${references.length} references for user ${stp.user_id}`,
            )
          }

          return {
            email: stp.user.email,
            firstName: stp.user.first_name,
            lastName: stp.user.last_name,
            profileId: stp.user.profile?.id,
            reference: {
              referenceText: references[0]?.reference_text,
              referenceId: references[0]?.id,
            },
            status:
              stp.seeker_training_provider_program_statuses.sort((a, b) => {
                return b.created_at.getTime() - a.created_at.getTime()
              })[0]?.status ?? 'Enrolled',
            hiringStatus: (await hiringStatus(stp.user.profile?.id as string)) ?? 'FAIL',
          }
        }),
      )

      const invitedStudents = await prisma.seekerInvite.findMany({
        where: {
          program_id: program.id,
          used_at: null,
        },
      })

      const mapped: {
        email: string | null
        firstName: string | null
        lastName: string | null
        profileId: string | undefined
        reference: { referenceText: string | null; referenceId: string | null }
        status: string
        hiringStatus: string
      }[] = invitedStudents.map((is) => ({
        email: is.email,
        firstName: is.first_name,
        lastName: is.last_name,
        profileId: '',
        reference: { referenceText: null, referenceId: null },
        status: 'not_enrolled',
        hiringStatus: 'No Profile',
      }))

      return {
        programName: program.name,
        programId: program.id,
        students: students.concat(mapped),
      }
    }),
  )
}

export const APIStudentService = {
  findFor,
}
