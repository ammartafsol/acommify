import React from "react";
import Accordion from "react-bootstrap/Accordion";
import AccordionItem from "react-bootstrap/AccordionItem";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import { useLocale } from "next-intl";

function Accordions({ items = [], containerClass, itemClass }) {
  const language = useLocale();
  return (
    <>
      <style>
        {`

.accordion {
  border: none !important; 
  display:flex;gap:20px;flex-direction:column;
}
.accordion-item {
  border: none; 
  border-radius: 0;
  border-bottom: 1px solid var(--black-new) !important; 
}
.accordion-item:last-of-type{
  border-bottom:none !important; 
}
.accordion-header {
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: var(--gray-new);
  font-size: var(--fs20);
  font-weight: 500;
}
.accordion-body {
  padding: 10px 0;
  border-top: none;
   color: var(--gray-new);
  font-size: var(--fs20);
  font-weight: 500;
}
  .accordion-body p{
  text-transform:capitalize;
  }
  .accordion-button{ 
  padding: 20px 18px ;
  border-radius: 8px;
background: #F4F7FD;
}
  .accordion-button > p{ 
color: var(--Black, #172A33);
font-size: var(--fs14);
font-style: normal;
font-weight: 600;
line-height: normal;
text-transform:capitalize;
}

.accordion-button:focus {
  box-shadow: none !important;
  border: none !important;
}
.accordion-button:not(.collapsed) {
  box-shadow: none !important;
    border-radius: 8px;
background: #F4F7FD;
     
}


}
@media (max-width: 1199px){
.accordion-body {
    font-size: var(--fs18);
  }
  .accordion-header {
    font-size: var(--fs18);
  }
}

@media (max-width: 991px){
.accordion-body {
    font-size: var(--fs16);
  }
  .accordion-header {
    font-size: var(--fs16);
  }
}

@media (max-width: 576px){
.accordion-body {
    font-size: var(--fs14);
  }
  .accordion-header {
    font-size: var(--fs14);
  }
    // .accordion-button{
    // background:#FFF !important;}
}
    .accordion-button:not(.collapsed){
    background:var(--Blue, #33B5F6) !important;
    }
       `}
      </style>
      <Accordion className={containerClass} defaultActiveKey="">
        {items?.map((item, index) => (
          <AccordionItem
            className={itemClass}
            eventKey={index.toString()}
            key={index}
          >
            <AccordionHeader>
              <p>{item.title}</p>
            </AccordionHeader>
            <AccordionBody>
              <p>{item.description}</p>
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

export default Accordions;
