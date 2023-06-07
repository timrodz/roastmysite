import { parseAllMarkdownImages } from "@/utils/url-sanity";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

const Editor: any = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading text editor...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [
      "link",
      // TODO: Removed until I figure out storage options
      // "image",
      ,
    ],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

interface Props {
  onUpdate: any;
}

export default function CreateRoastForm({ onUpdate }: Props) {
  const [value, valueSet] = useState("");

  return (
    <Editor
      modules={modules}
      formats={formats}
      value={value}
      onChange={(text: string) => {
        const parsedText = parseAllMarkdownImages(text);
        valueSet(parsedText);
        onUpdate(parsedText);
      }}
    />
  );
}
