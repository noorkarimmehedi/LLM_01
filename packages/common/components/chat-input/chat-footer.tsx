import { Flex } from '@repo/ui';
import Link from 'next/link';

export const ChatFooter = () => {
  return (
    <Flex className="w-full p-2" justify="center" gap="xs">
      <p className="text-xs text-muted-foreground">
        CCLeo is open source and your data is stored locally. project by{' '}
        <Link
          href="https://trendy.design"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          trendy.design
        </Link>
      </p>
    </Flex>
  );
};
