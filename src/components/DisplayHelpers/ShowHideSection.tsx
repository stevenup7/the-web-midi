import React, { ReactElement, useState } from "react";
import { Collapse } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import "./ShowHIdeSection.css";

interface ShowHideSectionProps {
  title: string | ReactElement;
  children: React.ReactNode;
  align?: "left" | "right";
}

function ShowHideSection({ title, children, align }: ShowHideSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (align === undefined) {
    align = "left";
  }
  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className={"form-label" + (align === "right" ? " show-hide-right" : "")}
        onClick={toggleSection}
      >
        {title} {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      <Collapse in={isOpen}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
}

export default ShowHideSection;
