import type { ComponentProps } from "react";
import { profile } from "@/data/profile";
import { downloadFile } from "@/lib/download";
import { ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-context";

/** A real link to the PDF that also works inside hosts that block ordinary downloads. */
export function CvLink(props: Omit<ComponentProps<typeof ButtonLink>, "href" | "download" | "onClick">) {
  const notify = useToast();
  return (
    <ButtonLink
      {...props}
      href={profile.cv.href}
      download={profile.cv.filename}
      onClick={(event) => {
        if (!window.claude) return;
        event.preventDefault();
        void downloadFile(profile.cv.href, profile.cv.filename).then((outcome) => {
          if (outcome === "saved") notify("CV download started");
          if (outcome === "cancelled") notify("Download cancelled");
        });
      }}
    >
      Download CV
    </ButtonLink>
  );
}
