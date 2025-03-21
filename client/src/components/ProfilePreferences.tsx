
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function ProfilePreferences() {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Profile Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="theme">Dark Mode</Label>
          <Switch
            id="theme"
            checked={preferences.theme === 'dark'}
            onCheckedChange={(checked) =>
              updatePreferences({ theme: checked ? 'dark' : 'light' })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="sector">Business Sector</Label>
          <div className="space-x-2">
            <Button
              variant={preferences.sector === 'B2B' ? 'default' : 'outline'}
              onClick={() => updatePreferences({ sector: 'B2B' })}
              size="sm"
            >
              B2B
            </Button>
            <Button
              variant={preferences.sector === 'B2C' ? 'default' : 'outline'}
              onClick={() => updatePreferences({ sector: 'B2C' })}
              size="sm"
            >
              B2C
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
