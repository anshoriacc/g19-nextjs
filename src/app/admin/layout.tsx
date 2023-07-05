import { Layout } from 'antd';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Layout.Sider>sider</Layout.Sider>
      {children}
    </>
  );
}
