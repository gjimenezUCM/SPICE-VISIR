import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tooltip } from '../basicComponents/Tooltip';
import { ISelectedObject } from "../constants/auxTypes";
import { ECommunityType, EExplanationTypes, ICommunityData, IUserData } from "../constants/perspectivesTypes";

import '../style/base.css';

export default {
  title: 'Complex/Tooltip',
  component: Tooltip,

} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />;

export const userExample = Template.bind({});

const user: IUserData = {
  id: '01',
  label: 'user1',
  community_number: 0,
  explicit_community: { ageGroup: "adult", Language: "ESP" },
  interactions: [],
  community_interactions: [],
  no_community_interactions: [],
  isMedoid: false,
  isAnonymous: false,
  isAnonGroup: false,
  implicit_community: {}

}

const userObject: ISelectedObject = {
  obj: user,
  position: { x: 100, y: 150 }
}
userExample.args = {
  selectedObject: userObject
};

export const commExample = Template.bind({});

const comm: ICommunityData = {
  id: "0",
  name: 'Community 1',
  explanations: [{
    explanation_type: EExplanationTypes.explicit_attributes,
    explanation_data: {},
    visible: true,
    order: 0,
  },
  ],
  users: [],
  allArtworks: new Map<string, number>(),
  representative_artworks: [],
  explicitCommunity: {},
  anonUsers: [],
  type: ECommunityType.implicit,
  explicitDataMap: new Map<string, Map<string, number>>()
}
const commObject: ISelectedObject = {
  obj: comm,
  position: { x: 100, y: 150 }
}
commExample.args = {
  selectedObject: commObject
};

