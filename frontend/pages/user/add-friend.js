import appContext from "context/AppContext";
import { useContext, useState } from "react";
import { fetchAPI } from "utils/api";

import Button from "components/elements/button";

export default function AddFriend() {
  const { user } = useContext(appContext);

  const [searchedUsername, setSearchedUsername] = useState("");
  const [friend, setFriend] = useState(null);

  const handleSearch = async () => {
    const friend = await fetchAPI(
      `/users/slug/${encodeURIComponent(searchedUsername)}`
    );
    setFriend(friend);
  };

  return user ? (
    <>
      <form
      style={{ paddingTop: "100px"}}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type='text'
          value={searchedUsername}
          onChange={(e) => {
            setSearchedUsername(e.target.value);
          }}
        />
        <Button
          button={{ text: "Look for this user" }}
          handleClick={handleSearch}
        />
      </form>
      {friend ? (
        <div>
          <span>
            {friend.username} - {friend.firstName} {friend.lastName}
          </span>
          <FriendAction
            status={friend.status}
            userId={user.id}
            friendId={friend.id}
          />
        </div>
      ) : (
        ""
      )}
    </>
  ) : (
    <div>Loading...</div>
  );
}

function FriendAction({ status, userId, friendId }) {
  const [requestSent, setRequestSent] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const handleRequest = async () => {
    const request = await fetchAPI("/network-requests", {
      method: "POST",
      body: JSON.stringify({ requester: userId, requestee: friendId }),
    });

    if (request) {
      setRequestSent(true);
    }
  };

  const acceptRequest = async () => {
    const friend = await fetchAPI(`/user/add-friend/${friendId}`, {
      method: "PUT",
    });
    if (friend) {
      setRequestStatus("Now in your network!");
    }
  };

  const denyRequest = async () => {
    const request = await fetchAPI(`/user/deny-friend/${friendId}`, {
      method: "DELETE",
    });
    if (request) {
      setRequestStatus("Request denied.");
    }
  };

  switch (status) {
    case "in-network":
      return <span>Already in Network</span>;
    case "request-sent":
      return <span>Request sent</span>;
    case "request-received":
      return (
        <>
          {requestStatus ? (
            <span>{requestStatus}</span>
          ) : (
            <>
              <span>Request received</span>
              <Button button={{ text: "Accept" }} handleClick={acceptRequest} />
              <Button button={{ text: "Decline" }} handleClick={denyRequest} />
            </>
          )}
        </>
      );
    default:
      return requestSent ? (
        <span>Request sent</span>
      ) : (
        <Button button={{ text: "Send request" }} handleClick={handleRequest} />
      );
  }
}
