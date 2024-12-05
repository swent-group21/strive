import { DBChallenge, DBGroup } from "../firebase/FirestoreCtrl";

export type RootStackParamList = {
  Welcome: undefined;
  WelcomeFinal: undefined;
  SignUp: undefined;
  SignIn: undefined;
  ForgotPassword: undefined;
  SetUser: undefined;
  Home: undefined;
  Camera: {
    group_id: string;
  };
  SetUsername: undefined;
  Maximize: {
    challenge: DBChallenge;
  };
  CreateChallenge: {
    picture_id: string;
    group_id: string;
  };
  Profile: undefined;
  MapScreen: undefined;
  GroupScreen: {
    currentGroup: DBGroup;
  }
  CreateGroup: undefined;
};
