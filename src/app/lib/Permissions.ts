type Permission = {
  impassable: boolean;
  interactable: boolean;
  label?: string;
};

export const PERMISSIONS: Record<number, Permission> = {
  0: {
    impassable: false,
    interactable: false,
  },
  1: {
    impassable: true,
    interactable: false,
  },
  2: {
    impassable: false,
    interactable: false,
  },
  3: {
    impassable: true,
    interactable: true,
    label: "Sign",
  },
};
