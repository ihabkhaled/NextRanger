import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Alert,
  Badge,
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  Divider,
  Input,
  Label,
  PageContainer,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Textarea,
} from '@/packages/ui-primitives';

describe('cn', () => {
  it('merges conditional classes and resolves Tailwind conflicts', () => {
    expect(cn('p-2', false, 'p-4')).toBe('p-4');
    expect(cn('text-sm', { hidden: false }, ['font-bold'])).toBe('text-sm font-bold');
  });
});

describe('Button', () => {
  it('defaults to type=button and fires clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Act</Button>);

    const button = screen.getByRole('button', { name: 'Act' });

    expect(button).toHaveAttribute('type', 'button');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    render(<Button variant="danger">Delete</Button>);

    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('bg-danger');
  });

  it('respects disabled', () => {
    render(<Button disabled>Frozen</Button>);

    expect(screen.getByRole('button', { name: 'Frozen' })).toBeDisabled();
  });
});

describe('buttonVariants', () => {
  it('produces distinct class bundles per variant and size', () => {
    expect(buttonVariants({ variant: 'primary' })).not.toBe(
      buttonVariants({ variant: 'secondary' }),
    );
    expect(buttonVariants({ size: 'sm' })).toContain('h-9');
    expect(buttonVariants({ size: 'lg' })).toContain('h-13');
  });
});

describe('form primitives', () => {
  it('associates Label and Input by htmlFor/id', () => {
    render(
      <Stack>
        <Label htmlFor="email-field">Email</Label>
        <Input id="email-field" type="email" />
      </Stack>,
    );

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('provides accessible select and textarea controls', () => {
    render(
      <Stack>
        <Label htmlFor="role-field">Role</Label>
        <Select id="role-field" defaultValue="editor">
          <option value="editor">Editor</option>
        </Select>
        <Label htmlFor="bio-field">Bio</Label>
        <Textarea id="bio-field" />
      </Stack>,
    );

    expect(screen.getByRole('combobox', { name: 'Role' })).toHaveValue('editor');
    expect(screen.getByRole('textbox', { name: 'Bio' })).toBeInTheDocument();
  });
});

describe('Card family', () => {
  it('renders title as an accessible heading with description and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card heading</CardTitle>
        </CardHeader>
        <CardDescription>Explains the card.</CardDescription>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByRole('heading', { name: 'Card heading' })).toBeInTheDocument();
    expect(screen.getByText('Explains the card.')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});

describe('display primitives', () => {
  it('renders badge tones and a semantic divider', () => {
    render(
      <Stack>
        <Badge tone="success">Healthy</Badge>
        <Divider data-testid="divider" />
      </Stack>,
    );

    expect(screen.getByText('Healthy').className).toContain('success');
    expect(screen.getByTestId('divider')).toHaveAttribute('class');
  });
});

describe('feedback primitives', () => {
  it('Alert exposes a status role with tone classes', () => {
    render(<Alert tone="danger">Problem</Alert>);

    const alert = screen.getByRole('status');

    expect(alert).toHaveTextContent('Problem');
    expect(alert.className).toContain('danger');
  });

  it('Spinner is announced by its label', () => {
    render(<Spinner label="Loading articles" />);

    expect(screen.getByRole('status', { name: 'Loading articles' })).toBeInTheDocument();
  });

  it('Skeleton is aria-hidden decoration', () => {
    render(<Skeleton data-testid="skeleton-sample" />);

    expect(screen.getByTestId('skeleton-sample')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('layout primitives', () => {
  it('Stack applies direction and gap variants', () => {
    render(
      <Stack direction="row" gap="sm" data-testid="stack-sample">
        <span>a</span>
      </Stack>,
    );

    const stack = screen.getByTestId('stack-sample');

    expect(stack.className).toContain('flex-row');
    expect(stack.className).toContain('gap-2');
  });

  it('PageContainer constrains width', () => {
    render(<PageContainer data-testid="page-container-sample">content</PageContainer>);

    expect(screen.getByTestId('page-container-sample').className).toContain('max-w-6xl');
  });
});
