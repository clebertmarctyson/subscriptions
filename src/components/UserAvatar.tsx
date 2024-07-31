import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "next-auth";

type Props = {
  user: User;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar>
      <AvatarImage src={user.image as string} alt={user.name as string} />
      <AvatarFallback>{user.name}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
