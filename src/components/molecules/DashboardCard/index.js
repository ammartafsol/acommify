import React, { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import classes from "./dashboardCard.module.css";
import Image from "next/image";
import Link from "next/link";

export default function DashboardCard({ data }) {
  const ref = useRef(null);
  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true,
    safeDisplacement: 10,
    decayRate: 0.9,
  });

  return (
    <div ref={ref} {...events} className={classes.dashboardCardContainer}>
      {data?.map((item, idx) => (
        <Link key={idx} href={item.route}>
          <div
            className={classes.dashboardCard}
            key={idx}
            style={{
              background: `url(${
                idx % 2 === 0
                  ? "/app-images/dashboardCardBg.png"
                  : "/app-images/dashboardCardBgDark.png"
              }) no-repeat center center / cover`,
            }}
          >
            <div className={classes.dashboardCardHeader}>
              <Image src={item.icon} alt="card" width={55} height={55} />
            </div>
            <div className={classes.dashboardCardBody}>
              <h2>{item.label}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
