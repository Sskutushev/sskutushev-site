import {
  GraphQLError,
  Kind,
  type ASTVisitor,
  type DocumentNode,
  type FragmentDefinitionNode,
  type SelectionSetNode,
  type ValidationContext,
} from 'graphql';

type Limits = { maxDepth: number; maxFields: number };

export function operationLimitsRule({ maxDepth, maxFields }: Limits) {
  return (context: ValidationContext): ASTVisitor => ({
    Document: {
      leave(document: DocumentNode) {
        const fragments = new Map<string, FragmentDefinitionNode>();
        for (const definition of document.definitions) {
          if (definition.kind === Kind.FRAGMENT_DEFINITION) {
            fragments.set(definition.name.value, definition);
          }
        }
        for (const definition of document.definitions) {
          if (definition.kind !== Kind.OPERATION_DEFINITION) continue;
          const result = inspect(definition.selectionSet, fragments, new Set());
          if (result.depth > maxDepth) {
            context.reportError(
              new GraphQLError(`Operation depth ${result.depth} exceeds limit ${maxDepth}`),
            );
          }
          if (result.fields > maxFields) {
            context.reportError(
              new GraphQLError(`Operation field count ${result.fields} exceeds limit ${maxFields}`),
            );
          }
        }
      },
    },
  });
}

function inspect(
  selectionSet: SelectionSetNode,
  fragments: ReadonlyMap<string, FragmentDefinitionNode>,
  visited: ReadonlySet<string>,
): { depth: number; fields: number } {
  let depth = 0;
  let fields = 0;
  for (const selection of selectionSet.selections) {
    if (selection.kind === Kind.FIELD) {
      fields += 1;
      if (selection.selectionSet) {
        const nested = inspect(selection.selectionSet, fragments, visited);
        depth = Math.max(depth, nested.depth + 1);
        fields += nested.fields;
      } else {
        depth = Math.max(depth, 1);
      }
    } else if (selection.kind === Kind.INLINE_FRAGMENT) {
      const nested = inspect(selection.selectionSet, fragments, visited);
      depth = Math.max(depth, nested.depth);
      fields += nested.fields;
    } else if (!visited.has(selection.name.value)) {
      const fragment = fragments.get(selection.name.value);
      if (fragment) {
        const nextVisited = new Set(visited).add(selection.name.value);
        const nested = inspect(fragment.selectionSet, fragments, nextVisited);
        depth = Math.max(depth, nested.depth);
        fields += nested.fields;
      }
    }
  }
  return { depth, fields };
}
