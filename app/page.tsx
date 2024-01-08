import Image from "next/image";
import UserAuth from "./user-auth/page";
import parseJSON from "./scripts/parseJSON";

export default function Home() {
//parseJSON();
	return (
    <main>
      <UserAuth />
    </main>
  );
}
