// @MOCK_DATA - Remove when connecting real backend
// All user-related mock data

import type { User, TeamMember } from "../types"

export const MOCK_CURRENT_USER: User = {
  id: "usr_001" /* @MOCK */,
  name: "Hassan Ali" /* @MOCK */,
  email: "hassan@callbackos.com" /* @MOCK */,
  avatar: null /* @MOCK */,
  timezone: "Asia/Karachi" /* @MOCK */,
  role: "Admin" /* @MOCK */,
  plan: "Growth" /* @MOCK */,
}

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm_001" /* @MOCK */,
    name: "Hassan Ali" /* @MOCK */,
    email: "hassan@callbackos.com" /* @MOCK */,
    role: "Admin" /* @MOCK */,
    status: "Active" /* @MOCK */,
    avatar: null /* @MOCK */,
  },
  {
    id: "tm_002" /* @MOCK */,
    name: "Sara Ahmed" /* @MOCK */,
    email: "sara@callbackos.com" /* @MOCK */,
    role: "Member" /* @MOCK */,
    status: "Active" /* @MOCK */,
    avatar: null /* @MOCK */,
  },
  {
    id: "tm_003" /* @MOCK */,
    name: "Omar Farooq" /* @MOCK */,
    email: "omar@callbackos.com" /* @MOCK */,
    role: "Member" /* @MOCK */,
    status: "Invited" /* @MOCK */,
    avatar: null /* @MOCK */,
  },
]
