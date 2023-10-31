import { Heading } from "@/frontend/components/Heading.component";
import { useProfileData } from "@/frontend/hooks/useProfileData";
import { GetOneProfileResponse } from "@/frontend/services/profile.service";
import { Badge, Divider, Flex, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { Text } from "../../../components/Text.component";
import { ProfileBox } from "./profileBox.component";

export const ProfileSkills = () => {
  const router = useRouter();
  const { profileId } = router.query;
  const {
    profileQuery: { data },
  } = useProfileData(profileId as string);

  const [profileData, setProfileData] = useState<GetOneProfileResponse>();
  useEffect(() => {
    if (data && data.profileSkills) {
      const res = data as GetOneProfileResponse; // Cast data to GetOneResponse type
      setProfileData(res);
    }
  }, [data]);

  return (
    <ProfileBox title="Skills" icon={FaScrewdriverWrench} onAddClick={() => {}}>
      <VStack align="left" pt="1rem" gap={2}>
        {profileData &&
          profileData.profileSkills.filter(
            (skill) => skill.masterSkill.type == "TECHNICAL"
          ).length !== 0 && (
            <>
              <Heading variant="h4" color={"greyscale.700"}>
                Technical Competencies
              </Heading>
              <Flex flexDir={"column"} gap="1.5rem">
                {profileData.profileSkills.map((skill, index) => {
                  if (skill.masterSkill.type == "TECHNICAL") {
                    return (
                      <Flex flexDir={"column"} gap="0.5rem" key={index}>
                        <Badge variant="primary" w="fit-content">
                          {skill.masterSkill.skill}
                        </Badge>
                        <Text type="b2">{skill.description}</Text>
                      </Flex>
                    );
                  }
                })}
              </Flex>

              <Divider borderColor="greyscale.300" />
            </>
          )}
        {profileData &&
          profileData.profileSkills.filter(
            (skill) => skill.masterSkill.type == "PERSONAL"
          ).length !== 0 && (
            <>
              <Heading variant="h4" color={"greyscale.700"}>
                Soft Skills
              </Heading>
              <Flex flexDir={"column"} gap="1.5rem">
                {profileData.profileSkills.map((skill, index) => {
                  if (skill.masterSkill.type == "PERSONAL") {
                    return (
                      <Flex flexDir={"column"} gap="0.5rem" key={index}>
                        <Badge variant="secondary" w="fit-content">
                          {skill.masterSkill.skill}
                        </Badge>
                        <Text type="b2">{skill.description}</Text>
                      </Flex>
                    );
                  }
                })}
              </Flex>
            </>
          )}
      </VStack>
    </ProfileBox>
  );
};
