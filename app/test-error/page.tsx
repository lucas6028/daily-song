export default function TestErrorPage() {
  throw new Error('This is a test error');

  // This code will never be reached
  return <div>This page intentionally throws an error</div>;
}
