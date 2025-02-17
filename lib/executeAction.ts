type ActionResponse = {
  error?: string;
};

type ActionFunction = () => Promise<void>;

export async function executeAction({
  actionFn,
}: {
  actionFn: ActionFunction;
}): Promise<ActionResponse> {
  try {
    await actionFn();
    return {};
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
} 