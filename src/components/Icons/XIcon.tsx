import * as React from "react";

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        id="twitter"
        {...props}
        fill="none"
        viewBox="0 0 512 512"
    >
        <g clipPath="url(#clip0_84_15698)">
            <path
                fill="currentColor"
                d="M355.904 100h52.928L293.2 232.16 429.232 412H322.72l-83.424-109.072L143.84 412H90.88l123.68-141.36L84.065 100H193.28l75.408 99.696zm-18.576 280.32h29.328L177.344 130.016h-31.472z"
            ></path>
        </g>
        <defs>
            <clipPath id="clip0_84_15698">
                <path fill="currentColor" d="M0 0h512v512H0z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default XIcon;