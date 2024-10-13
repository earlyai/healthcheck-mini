import { Community } from "@/models/github/community";
import { StatusCheck } from "@/types/checks";

/**
 * Checks the status of the Code of Conduct (CoC) for a given community.
 * Returns a status object indicating whether a CoC is present and its implications.
 * 
 * @param community - The community object containing file information.
 * @returns StatusCheck - An object representing the CoC status and related messages.
 * @throws No exceptions are thrown.
 */
export default function codeOfConduct(community: Community) {
  const response: StatusCheck = {
    title: "Code of Conduct",
    status: "unknown",
    description: "-",
    extra: "-",
  };

  if (community.files?.code_of_conduct) {
    response.status = "success";
    response.description = "You have a CoC.";
    response.extra = "No action required.";
  }

  if (!community.files || !community.files.code_of_conduct) {
    response.status = "error";
    response.description = "You do not have a CoC in your repo.";
    response.extra =
      "This is important for people to know your project and community is safe.";
  }

  return response;
}
