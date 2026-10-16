"use client";
import MainLayout from "../layouts/MainLayout";
import { EmptyState } from "../components/UI";
import { FiCompass } from "react-icons/fi";
export default function NotFound() {
  return (
    <MainLayout>
      <div className="container">
        <EmptyState
          icon={FiCompass}
          title="A little off the beaten path."
          description="This page couldn’t be found. There are still plenty of good things waiting in the collection."
        />
      </div>
    </MainLayout>
  );
}
