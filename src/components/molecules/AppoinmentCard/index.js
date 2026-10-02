"use client";
import React from "react";
import styles from "./style.module.css";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "@/resources/hooks/useTranslations";

export default function AppointmentCard({ t, data, route }) {
  const router = useRouter();
  const t1 = useTranslations("appointmentsPage.Appointments");
  return (
    <div key={data?.id} className={styles.AppointmentCard}>
      <div className={styles?.appointmentTop}>
        <Image
          src={"/svg/CircularCalender.svg"}
          height={53}
          width={53}
          alt={t.title}
        />
      </div>
      <div className={styles?.appointmentBottom}>
        <h5>{t.title}</h5>
        <p>{t.description}</p>
        {data?.createdAt && <p>Date: {data.createdAt}</p>}
        <Button
          variant={"primary"}
          label={t1("bookAppointment")}
          onClick={() => router.push(route)}
        />
      </div>
    </div>
  );
}
