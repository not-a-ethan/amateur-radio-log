"use client";

import { useTheme } from "next-themes";

import { Switch } from "@heroui/react";

import { Moon, Sun } from "@gravity-ui/icons";

export function ThemeSwitcher(props: any) {
    const {resolvedTheme, setTheme, theme} = useTheme();

    function changeTheme(darkMode: boolean): void {
        setTheme(darkMode ? "dark": "light");
    };

    const className = props.className;

    return (
        <Switch onChange={changeTheme} className={className}>
          {({isSelected}) => (
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb>
                  <Switch.Icon>
                    {isSelected ? (
                      <Moon className="size-3 text-inherit opacity-100" />
                    ) : (
                      <Sun className="size-3 text-inherit opacity-70" />
                    )}
                  </Switch.Icon>
                </Switch.Thumb>
              </Switch.Control>
            </Switch.Content>
          )}
        </Switch>
    );
};