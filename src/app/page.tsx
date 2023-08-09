import Image from 'next/image'
import { trpc } from "./api/trpc/[trpc]";

export default async function Home() {

 const users = await trpc.userList.query();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">


      {users.map((u, index) => (
          <div key={index}>
            <p>u.fullName</p>

          </div>
      ))}

      </div>
    </main>
  )
}
