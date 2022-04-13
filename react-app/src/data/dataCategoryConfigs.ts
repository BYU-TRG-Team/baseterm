import { TbxElement } from "../types/tbxElements";

export type DataCategory = {
  name: string;
  constrainedValues: false;
  constrainedLevels: false;
} |
{
  name: string;
  constrainedValues: true;
  constrainedLevels: false;
  values: string[],
} |
{
  name: string;
  constrainedValues: false,
  constrainedLevels: true,
  levels: TbxElement[]
} |
{
  name: string;
  levels: TbxElement[],
  constrainedValues: true;
  constrainedLevels: true;
  values: string[],
}

export type DataCategoryConfig = 
  DataCategory[];

export const termNoteDataCategories: DataCategoryConfig = 
  [
    {
      name: "grammaticalGender",
      constrainedLevels: false,
      constrainedValues: true,
      values: [
        "masculine",
        "feminine",
        "neuter",
        "other"
      ]
    },
    {
      name: "geographicalUsage",
      constrainedLevels: false,
      constrainedValues: false,
    },
    {
      name: "termLocation",
      constrainedLevels: false,
      constrainedValues: true,
      values: [
        "checkBox",
        "comboBox",
        "comboBoxElement",
        "dialogBox",
        "groupBox",
        "informativeMessage",
        "interactiveMessage",
        "menuItem",
        "progressBar",
        "pushButton",
        "radioButton",
        "slider",
        "spinBox",
        "tab",
        "tableText",
        "textBox",
        "toolTip",
        "user-definedType"
      ]
    },
    {
      name: "termType",
      constrainedLevels: false,
      constrainedValues: true,
      values: [
        "fullForm",
        "acronym",
        "abbreviation",
        "shortForm",
        "variant",
        "phrase"
      ]
    },
    {
      name: "administrativeStatus",
      constrainedValues: true,
      constrainedLevels: false,
      values: [
        "admittedTerm-admn-sts",
        "deprecatedTerm-admn-sts",
        "supersededTerm-admn-sts",
        "preferredTerm-admn-sts",
      ]
    },
    {
      name: "partOfSpeech",
      constrainedValues: true,
      constrainedLevels: false,
      values: [
        "adjective",
        "noun",
        "other",
        "verb",
        "adverb"
      ]
    }
  ];

export const adminDataCategories: DataCategoryConfig = 
  [
    {
      name: "customerSubset",
      constrainedValues: false,
      constrainedLevels: true,
      levels: [
        TbxElement.ConceptEntry,
        TbxElement.Term
      ]
    },
    {
      name: "projectSubset",
      constrainedValues: false,
      constrainedLevels: true,
      levels: [
        TbxElement.ConceptEntry,
        TbxElement.Term
      ]
    },
    {
      name: "Source",
      constrainedValues: false,
      constrainedLevels: true,
      levels: [
        TbxElement.ConceptEntry,
        TbxElement.Term,
        TbxElement.LangSec
      ]
    }
  ];

export const descripDataCategories: DataCategoryConfig = 
  [
    {
      name: "context",
      constrainedValues: false,
      constrainedLevels: true,
      levels: [
        TbxElement.Term
      ]
    },
    {
      name: "definition",
      constrainedValues: false,
      constrainedLevels: true,
      levels: [
        TbxElement.ConceptEntry,
        TbxElement.LangSec
      ]
    },
    {
      name: "subjectField",
      constrainedValues: false,
      constrainedLevels: true,
      levels: [
        TbxElement.ConceptEntry
      ]
    },
  ];

export const transacDataCategories: DataCategoryConfig = 
  [
    {
      name: "transactionType",
      constrainedLevels: true,
      constrainedValues: true,
      values: [
        "origination",
        "modification"
      ],
      levels: [
        TbxElement.ConceptEntry,
        TbxElement.LangSec,
        TbxElement.Term
      ]
    },
  ];

export const xrefDataCategories: DataCategoryConfig = 
  [
    {
      name: "xGraphic",
      constrainedLevels: true,
      constrainedValues: false,
      levels: [
        TbxElement.ConceptEntry,
        TbxElement.LangSec
      ]
    }
  ];

export const refDataCategories: DataCategoryConfig = 
  [
    {
      name: "xGraphic",
      constrainedLevels: true,
      constrainedValues: false,
      levels: [
        TbxElement.ConceptEntry,
        TbxElement.Term
      ]
    }
  ];

export const transacNoteDataCategories: DataCategoryConfig = 
  [
    {
      name: "responsibility",
      constrainedValues: false,
      constrainedLevels: true,
      levels: [
        TbxElement.TransacGrp
      ]
    }
  ];