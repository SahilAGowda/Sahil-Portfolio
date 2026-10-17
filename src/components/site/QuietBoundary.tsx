import { Component, type ReactNode } from "react";

interface QuietBoundaryProps {
  children: ReactNode;
  /** Called once when something inside throws, for example a code chunk that failed to load. */
  onError: () => void;
}

/** Keeps a failure in an optional feature (the search dialog, the 3D diagram) from taking the whole page down. */
export class QuietBoundary extends Component<QuietBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
