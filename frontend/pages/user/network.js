import appContext from "context/AppContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { fetchAPI } from "utils/api";

import ArrowRight from "../../src/assets/icons/arrow-right.svg";
import Search from "../../src/assets/icons/searchicon.svg";
import UserAdd from "../../src/assets/icons/user-plus.svg";
import UserPending from "../../src/assets/icons/user-pending.svg";
import UserMinus from "../../src/assets/icons/user-minus.svg";

import Button from "components/elements/button";

export default function Network() {
  const { user } = useContext(appContext);
  // console.log(user);

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [requestStatus, setRequestStatus] = useState("");

  const [friends, setFriends] = useState([]);

  const [searchUsername, setSearchUsername] = useState("");

  const [friend, setFriend] = useState(null);
  const [friendError, setFriendError] = useState("");

  const nav = ["Mon réseau", "Demandes envoyées", "Demandes reçues"];
  const [navNetwork, setNavNetwork] = useState(nav[0]);

  const handleSearch = async (e) => {
    if (e.key === "Enter" || e === "Icon") {
      try {
        const friend = await fetchAPI(
          `/users/slug/${encodeURIComponent(searchUsername)}`
        );
        setFriend(friend);
      } catch (err) {
        setFriendError(err.message);
      }
    }
  };

  useEffect(() => {
    async function fetchRequests() {
      const received = await fetchAPI("/network-requests/received");
      if (received) {
        setReceivedRequests(received);
      }
      const sent = await fetchAPI("/network-requests/sent");
      if (sent) {
        setSentRequests(sent);
      }
    }
    if (user) {
      fetchRequests();
      setFriends(user.friends);
    }
  }, [user]);

  useEffect(() => {
    if (searchUsername === "") {
      setFriend(null);
    }
  });

  const acceptRequest = async (requester) => {
    const friend = await fetchAPI(`/user/add-friend/${requester.id}`, {
      method: "PUT",
    });
    if (friend) {
      setRequestStatus("Now in your network!");
      setFriends([...friends, friend]);
    }
  };

  const denyRequest = async (requester) => {
    const request = await fetchAPI(`/user/deny-friend/${requester.id}`, {
      method: "DELETE",
    });
    if (request) {
      setRequestStatus("Request denied.");
    }
  };
  return user ? (
    <div className='network-main-container'>
      <div className='network-nav'>
          {/* {nav.map(item => {
            <p>{item}</p>
          })} */}
          {nav}
        <ul>
          <li>zdefgh</li>
        </ul>
      </div>
      <div className='my-network'>
        <div className='input-container'>
          <input
            type='search'
            value={searchUsername}
            onChange={(e) => {
              setSearchUsername(e.target.value);
              setFriendError("");
            }}
            onKeyDown={(e) => {
              handleSearch(e);
            }}
            placeholder='Rechercher un freelenger'
          />
          <Search onClick={() => handleSearch("Icon")} />
        </div>
        {friend && searchUsername ? (
          <ul className='my-friends'>
            <li key={friend.id}>
              <div className='friend-picture' />
              <div className='friend-infos'>
                <p>
                  {friend.firstName} {friend.lastName}
                </p>
              </div>
              <FriendAction
                status={friend.status}
                userId={user.id}
                friendId={friend.id}
              />
            </li>
          </ul>
        ) : (
          <>
            {friendError ? (
              <div className='no-network'>
                <div className='no-network-texts'>
                  <h3>Il semble que cet utilisateur n’existe pas ! </h3>
                  <p className='paragraph'>
                    Il y a une erreur avec le nom d’utilisateur. Cela peut
                    provenir d’une faute d’orthographe.
                  </p>
                </div>
                <img src='/images/friendError.png' alt='' />
              </div>
            ) : (
              <>
                {friends.length ? (
                  <ul className='my-friends'>
                    {friends.map((friend) => (
                      <li key={friend.id}>
                        <div className='friend-picture' />
                        <div className='friend-infos'>
                          <p>
                            {friend.firstName} {friend.lastName}
                          </p>
                          <div className='friend-job'>
                            <span>{friend.job_1.name}</span>
                            <span>{friend.job_2.name}</span>
                            <span>{friend.job_3.name}</span>
                          </div>
                        </div>
                        {/* <div className='remove'>
                          <UserMinus />
                        </div> */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className='no-network'>
                    <div className='no-network-texts'>
                      <h3>
                        Quel dommage, tu n’as pas encore de réseau pour
                        l’instant !
                      </h3>
                      <p className='paragraph'>
                        Rejoins notre communauté sur circle, et rencontre des
                        freelengers chauds près de chez toi !
                      </p>
                      <button
                        className='btn-primary'
                        onClick={() =>
                          window.open(
                            "https://freelengers.circle.so/home",
                            "_blank"
                          )
                        }
                      >
                        Découvre notre communauté ! <ArrowRight />
                      </button>
                    </div>
                    <img src='/images/mynetwork.png' alt='' />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      {/* <h1>My Network</h1>

      <h2>Pending Requests</h2>
      {receivedRequests.length ? (
        <ul>
          {receivedRequests.map((req) => (
            <li key={req.id}>
              <span>
                From {req.requester.username} - {req.requester.firstName}{" "}
                {req.requester.lastName}
              </span>
              {requestStatus ? (
                <span>{requestStatus}</span>
              ) : (
                <>
                  <Button
                    button={{ text: "Accept" }}
                    handleClick={() => {
                      acceptRequest(req.requester);
                    }}
                  />
                  <Button
                    button={{ text: "Decline" }}
                    handleClick={() => {
                      denyRequest(req.requester);
                    }}
                  />
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
      <h2>Sent Requests</h2>
      {sentRequests.length ? (
        <ul>
          {sentRequests.map((req) => (
            <li key={req.id}>
              <span>
                To {req.requestee.username} - {req.requestee.firstName}{" "}
                {req.requestee.lastName}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
      <h2>My Network</h2>
      {friends.length ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>{friend.username}</li>
          ))}
        </ul>
      ) : (
        ""
      )} */}
    </div>
  ) : null;
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
      return (
        <div className='request-sent'>
          <UserPending />
        </div>
      );
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
        <div className='modal'>
          <img src='/images/requestSent.png' alt='' />
          <h3>Votre invitation a bien été envoyée</h3>
          <button className='btn-primary' onClick={() => setRequestSent(false)}>
            Retourner à mon réseau
          </button>
        </div>
      ) : (
        <UserAdd onClick={handleRequest} />
      );
  }
}
