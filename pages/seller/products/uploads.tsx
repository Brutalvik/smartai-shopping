import { GetServerSidePropsContext } from "next";
import { verifyToken } from "@/utils/helper";
import ProductForm from "@/components/ProductForm";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  console.log(">>> SSR cookies:", ctx.req.headers.cookie); // ⬅️ Log raw cookie string
  console.log(">>> parsed token:", ctx.req.cookies?.token); // ⬅️ See if it's there

  const token = ctx.req.cookies?.token;
  const user = verifyToken(token);
  console.log(">>> decoded user:", user); // ⬅️ See if token is valid

  if (!user || typeof user === "string") {
    return {
      redirect: {
        destination: `/auth/signin?redirect=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        id: user.sub || user.id,
        email: (user as any)?.email,
        name: (user as any)?.name || "",
      },
    },
  };
}


export default function ProtectedPage({ user }: { user: any }) {
  return (
    <UserProviderFromSSR user={user}>
     <ProductForm />
    </UserProviderFromSSR>
  );
}
