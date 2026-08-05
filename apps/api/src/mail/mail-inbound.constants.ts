/** RFC 5322 line length guidance; matches DB column and SendMailDto. */
export const INBOUND_MAX_SUBJECT_LENGTH = 998;

/** Max stored body size per field (1 MiB of UTF-16 code units ≈ string length). */
export const INBOUND_MAX_BODY_LENGTH = 1024 * 1024;
