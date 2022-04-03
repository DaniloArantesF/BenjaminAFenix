import axios, { AxiosResponse } from "axios";
import { selectToken, setError } from "../app/authSlice";
import { Channel, Guild } from "../app/dashboardSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const useDiscord = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);

  const getGuildVoiceChannels = async (guildId: string) => {
    try {
      const res: AxiosResponse<any> = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/channels`,
        {
          params: { guildId, token },
        }
      );
      return res.data.channels;
    } catch (error) {
      !error &&
        dispatch(
          setError({
            message: "Error fetching voice channels",
            code: 401,
            redirect_path: "/login",
          })
        );
      return [];
    }
  };

  const getUserData = async (token: string) => {
    try {
      const res: AxiosResponse<any> = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/user`,
        {
          params: { token },
        }
      );
      const { id, username, avatar } = res.data;
      return { id, username, avatar };
    } catch (error) {
      !error &&
        dispatch(
          setError({
            message: "Error getting user data",
            code: 401,
            redirect_path: "/login",
          })
        );
      return { id: "", username: "", avatar: "" };
    }
  };

  const getUserGuilds = async (token: string) => {
    try {
      const res: AxiosResponse<any> = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/guilds`,
        {
          params: { token },
        }
      );

      const guilds: Guild[] = res.data.guilds;
      return guilds;
    } catch (error) {
      !error &&
        dispatch(
          setError({
            message: "Error getting user guilds",
            code: 401,
            redirect_path: "/login",
          })
        );
      return [];
    }
  };

  const getUserVoiceChannel = async (token: string, id: string) => {
    try {
      const res: AxiosResponse<any> = await axios.get(
        `${process.env.REACT_APP_BOT_HOSTNAME}/discord/connection`,
        {
          params: { token },
        }
      );

      return {
        guild: res.data.guild as Guild,
        channel: res.data.channel as Channel,
      };
    } catch (error) {
      console.error("Error getting user connection");
      !error && dispatch(setError("Error getting user connection"));
      return {
        guild: null,
        channel: null,
      };
    }
  };

  return {
    getGuildVoiceChannels,
    getUserData,
    getUserGuilds,
    getUserVoiceChannel,
  };
};

/**
 * Returns the url for a discord avatar given an avatar hash
 * @param type Type of avatar, either 'user' or 'guild'
 * @param id Id of avatar owner
 * @param avatarHash Avatar hash given by discord
 * @param size Size of img desired
 * @returns
 */
export const getDiscordAvatar = (
  type = "user",
  id: string,
  avatarHash: string,
  size = 64
) => {
  const baseUrl = "https://cdn.discordapp.com/";
  const userPath = `avatars/${id}/${avatarHash}.png`;
  const guildPath = `icons/${id}/${avatarHash}.png`;

  if (type === "user") {
    return baseUrl + userPath + `?size=${size}`;
  } else if (type === "guild") {
    return baseUrl + guildPath + `?size=${size}`;
  }
};

export default useDiscord;
