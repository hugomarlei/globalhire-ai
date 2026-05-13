import * as Sentry from "@sentry/nextjs";
import { getSentryInitOptions } from "./lib/sentry-privacy";

Sentry.init(getSentryInitOptions());
