import { useState } from "react";
import { Box, Text, Image, Button } from "@skynexui/components";
import appConfig from "../../config.json";

export default function MessageList(props) {
  const [name, setName] = useState("");
  const [repo, setRepo] = useState(0);
  const [seg, setSeg] = useState(0);
  function fetchData(username, idClass) {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((json) => {
        setName(json.name);
        setRepo(`Repositórios: ${json.public_repos}`);
        setSeg(`Seguidores: ${json.followers}`);
        document.getElementById(idClass).classList.remove("loadingBox");
      });
  }
  function resetData(idClass) {
    setName("");
    setRepo("");
    setSeg("");
    document.getElementById(idClass).classList.add("loadingBox");
  }
  return (
    <Box
      id="scrollChat"
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
        overflowX: "hidden",
      }}
    >
      {props.messages.map((message) => {
        return (
          <Box
            id="oi"
            styleSheet={
              message.de === props.username
                ? {
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }
                : {
                    width: "100%",
                  }
            }
          >
            <Text
              key={message.id}
              tag="li"
              styleSheet={
                message.de !== props.username
                  ? {
                      borderRadius: "5px",
                      padding: "6px",
                      marginBottom: "12px",
                      backgroundColor: "hsla(230, 90%, 10%, 0.500)",
                      hover: {
                        backgroundColor: appConfig.theme.colors.primary[800],
                      },
                      active: {
                        backgroundColor: appConfig.theme.colors.primary[800],
                      },
                      wordBreak: "break-all",
                      width: "70%",
                    }
                  : {
                      borderRadius: "5px",
                      padding: "6px",
                      marginBottom: "12px",
                      backgroundColor: "hsla(200, 50%, 40%, 0.400)",
                      hover: {
                        backgroundColor: appConfig.theme.colors.primary[800],
                      },
                      active: {
                        backgroundColor: appConfig.theme.colors.primary[800],
                      },
                      wordBreak: "break-all",
                      alignItems: "flex-end",
                      width: "70%",
                    }
              }
            >
              <Box
                styleSheet={
                  message.de !== props.username
                    ? {
                        marginBottom: "8px",
                        position: "relative",
                      }
                    : {
                        marginBottom: "8px",
                        position: "relative",
                      }
                }
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                  onMouseOver={() => {
                    document.getElementById(`${message.id}box`).style.display =
                      "block";
                    fetchData(message.de, `${message.id}box`);
                  }}
                  onMouseOut={() => {
                    document.getElementById(`${message.id}box`).style.display =
                      "none";
                    resetData(`${message.id}box`);
                  }}
                  src={`https://github.com/${message.de}.png`}
                />
                {/* esse é o box =================== */}
                <Box
                  id={`${message.id}box`}
                  className="loadingBox"
                  styleSheet={{
                    minWidth: "200px",
                    top: "-8px",
                    left: "20px",
                    position: "absolute",
                    display: "none",
                    backgroundColor: "hsl(200, 20%, 20%)",
                    borderRadius: "25px",
                    padding: "5px",
                  }}
                >
                  <Image
                    src={`https://github.com/${message.de}.png`}
                    styleSheet={{
                      width: "50px",
                      borderRadius: "50%",
                      float: "left",
                      margin: "5px",
                    }}
                  />
                  <Text>
                    {`${name}`}
                    <br />
                  </Text>
                  <Text styleSheet={{ fontSize: "12px" }}>
                    {repo}
                    <br />
                    {seg}
                  </Text>
                </Box>
                {/* até aqui ====================== */}
                <Text tag="strong">{message.de}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
                <Button
                  onClick={() => {
                    props.removeMessage(message.id);
                  }}
                  colorVariant="neutral"
                  label={<span className="material-icons">clear</span>}
                  styleSheet={{
                    background: "none",
                    position: "absolute",
                    right: "-7px",
                    hover: {
                      backgroundColor: appConfig.theme.colors.primary[400],
                    },
                    top: "-10px",
                  }}
                />
              </Box>
              {message.texto.startsWith(":sticker:") ? (
                <Image
                  src={message.texto.replace(":sticker:", "")}
                  styleSheet={{ maxWidth: "120px" }}
                />
              ) : (
                message.texto
              )}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
