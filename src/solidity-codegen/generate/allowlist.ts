import { IContract } from "@/store/reducers/contractReducer";
import {
  AST,
  binaryExpression,
  blockComment,
  expressionStatement,
  functionCallExpression,
  functionDeclaration,
  identifierExpression,
  ifStatement,
  parseVariableDeclaration,
  returnStatement,
  variableDeclaration,
} from "@/solidity-language";

export function generateAllowlist(
  contract: Pick<
    IContract,
    "limitPerWallet" | "ownerMintAllowance" | "allowlistDestinations"
  >
): (AST.Declaration | AST.BlockComment)[] {
  const hasAllowlist =
    contract.ownerMintAllowance !== undefined ||
    contract.allowlistDestinations.length > 0;

  if (!hasAllowlist && contract.limitPerWallet === undefined) {
    return [];
  }

  return [
    blockComment({ value: "MINTING LIMITS", commentType: "/*" }),
    variableDeclaration({
      name: "mintCountMap",
      modifiers: ["private"],
      typeAnnotation: "mapping(address => uint256)",
    }),
    variableDeclaration({
      name: "allowedMintCountMap",
      modifiers: ["private"],
      typeAnnotation: "mapping(address => uint256)",
    }),
    ...(contract.limitPerWallet !== undefined
      ? [
          parseVariableDeclaration(
            `uint256 public constant MINT_LIMIT_PER_WALLET = ${contract.limitPerWallet}`
          ),
        ]
      : []),
    ...(hasAllowlist && contract.limitPerWallet !== undefined
      ? [
          functionDeclaration({
            name: "max",
            arguments: ["uint256 a", "uint256 b"],
            modifiers: ["private pure"],
            returns: {
              modifiers: [],
              typeAnnotation: "uint256",
            },
            body: [returnStatement(identifierExpression("a >= b ? a : b"))],
          }),
        ]
      : []),
    functionDeclaration({
      name: "allowedMintCount",
      arguments: ["address minter"],
      modifiers: ["public", "view"],
      returns: {
        modifiers: [],
        typeAnnotation: "uint256",
      },
      body: [
        ...(hasAllowlist && contract.limitPerWallet !== undefined
          ? [
              ifStatement({
                condition: identifierExpression("saleIsActive"),
                body: [
                  returnStatement(
                    binaryExpression({
                      lhs: functionCallExpression({
                        callee: identifierExpression("max"),
                        arguments: [
                          identifierExpression("allowedMintCountMap[minter]"),
                          identifierExpression("MINT_LIMIT_PER_WALLET"),
                        ],
                      }),
                      operator: "-",
                      rhs: identifierExpression("mintCountMap[minter]"),
                    })
                  ),
                ],
              }),
            ]
          : []),
        ...(hasAllowlist
          ? [
              returnStatement(
                binaryExpression({
                  lhs: identifierExpression("allowedMintCountMap[minter]"),
                  operator: "-",
                  rhs: identifierExpression("mintCountMap[minter]"),
                })
              ),
            ]
          : [
              returnStatement(
                binaryExpression({
                  lhs: identifierExpression("MINT_LIMIT_PER_WALLET"),
                  operator: "-",
                  rhs: identifierExpression("mintCountMap[minter]"),
                })
              ),
            ]),
      ],
    }),
    functionDeclaration({
      name: "updateMintCount",
      arguments: ["address minter", "uint256 count"],
      modifiers: ["private"],
      body: [
        expressionStatement({
          expression: binaryExpression({
            lhs: identifierExpression("mintCountMap[minter]"),
            operator: "+=",
            rhs: identifierExpression("count"),
          }),
        }),
      ],
    }),
  ];
}
