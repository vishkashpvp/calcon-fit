export const MESSAGES = {
  AUTH: {
    UNAUTHORIZED: "You must be signed in to access this resource.",
    UNKNOWN_ERROR: "Something went wrong during authentication.",
  },
  VALIDATION: {
    INVALID_DATE_FORMAT: "Date must be in YYYY-MM-DD format.",
    MEAL_MIN_ONE_FOOD: "At least one food item is required.",
    REQUIRED_FIELD: "This field is required.",
    INVALID_NUMBER: "Must be a valid number.",
    POSITIVE_NUMBER: "Must be a positive number.",
  },
  PROFILE: {
    SETUP_SUCCESS: "Profile set up successfully!",
    UPDATE_SUCCESS: "Profile updated successfully!",
    INCOMPLETE: "Please complete your profile setup.",
  },
  GAMIFICATION: {
    LEVEL_UP: "Level up! You've reached",
    STREAK_MILESTONE: "Streak milestone!",
    XP_EARNED: "XP earned!",
  },
} as const;
