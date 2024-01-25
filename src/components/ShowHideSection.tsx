import React, { useState } from "react";
import { Collapse } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

interface ShowHideSectionProps {
  title: string;
  children: React.ReactNode;
}

function ShowHideSection({ title, children }: ShowHideSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <label className="form-label" onClick={toggleSection}>
        {title} {isOpen ? <ChevronUp /> : <ChevronDown />}
      </label>

      <Collapse in={isOpen}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
}

export default ShowHideSection;
