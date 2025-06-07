import { GetServerSidePropsContext } from "next";
import { verifyToken } from "@/utils/helper";
import ProductForm from "@/components/ProductForm";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.req.cookies?.token;
  const user = verifyToken(token);

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
