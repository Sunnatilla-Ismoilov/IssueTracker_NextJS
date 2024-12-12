import { Metadata } from "next";
import LatestIssues from "./LatestIssues";

export default function Home() {
  return <LatestIssues />;
}

export const metadata: Metadata = {
  title: "Issue Tracker Dashboard",
  description: "Dashboard for the issue tracker app",
};
