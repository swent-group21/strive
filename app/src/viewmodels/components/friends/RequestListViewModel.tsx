import {
  acceptFriend,
  rejectFriend,
} from "@/src/models/firebase/SetFirestoreCtrl";

/**
 * Request List with all users that have sent a friend request to the current user
 * @param requests : list of users that have sent a friend request
 * @param uid : current user's id
 */
export function useRequestListViewModel({ uid }: { readonly uid: string }) {
  const handleAccept = (requestId: string) => {
    acceptFriend(uid, requestId);
  };

  const handleDecline = (requestId: string) => {
    rejectFriend(uid, requestId);
  };

  return {
    handleAccept,
    handleDecline,
  };
}
