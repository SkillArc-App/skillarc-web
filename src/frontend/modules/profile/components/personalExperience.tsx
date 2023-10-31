import { useProfileData } from "@/frontend/hooks/useProfileData";
import { EditIcon } from "@chakra-ui/icons";
import { Button, Divider, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { Text } from "../../../components/Text.component";
import { ProfileBox } from "./profileBox.component";

export const PersonalExperience = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const {
    profileQuery: { data },
    isMyProfile,
  } = useProfileData(profileId as string);

  return (
    <ProfileBox
      title="Personal Experience"
      icon={FaPeopleCarryBox}
      onAddClick={() => {}}
    >
      <Flex flexDir={"column"} gap="1rem" pt="1rem">
        {data?.personalExperience.map((personalExperience, index) => {
          return (
            <Flex key={index}>
              <Flex direction="column" w="100%" gap="0.5rem">
                <Flex direction="column" gap="0.5rem" w="100%">
                  {!personalExperience.end_date && (
                    <Text type="b3" color="greyscale.600">
                      Current
                    </Text>
                  )}
                  {personalExperience.end_date && (
                    <Text type="b3" color="greyscale.600">
                      {personalExperience.start_date} -{" "}
                      {personalExperience.end_date}
                    </Text>
                  )}

                  <Heading variant="h4" color={"greyscale.900"}>
                    {personalExperience.activity}
                  </Heading>

                  <Text type="b2" color="greyscale.600">
                    {personalExperience.description}
                  </Text>
                </Flex>
                <Divider borderColor="greyscale.300" />
              </Flex>
              {isMyProfile && (
                <Button
                  variant={"icon"}
                  color="greyscale.600"
                  onClick={() =>
                    router.push({
                      pathname: `${profileId}/editProfile`,
                      query: {
                        section: "personalExperience",
                        personalExperienceId: personalExperience.id,
                      },
                    })
                  }
                >
                  <EditIcon />
                </Button>
              )}
            </Flex>
          );
        })}
      </Flex>
    </ProfileBox>
  );
};
